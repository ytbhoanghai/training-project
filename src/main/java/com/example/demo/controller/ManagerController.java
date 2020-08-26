package com.example.demo.controller;

import com.example.demo.controller.ui.*;
import com.example.demo.entity.*;
import com.example.demo.exception.*;
import com.example.demo.form.*;
import com.example.demo.response.RoleResponse;
import com.example.demo.response.SimpleRoleResponse;
import com.example.demo.security.SecurityUtil;
import com.example.demo.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/manager")
@Validated
@Transactional
public class ManagerController implements IStore, IStaff, IRole, IProduct, ICategory, IOrder {

    private RoleService roleService;
    private StaffService staffService;
    private StoreService storeService;
    private ProductService productService;
    private CategoryService categoryService;
    private OrderService orderService;
    private SecurityUtil securityUtil;

    @Autowired
    public ManagerController(
            RoleService roleService,
            StaffService staffService,
            StoreService storeService,
            ProductService productService,
            CategoryService categoryService,
            OrderService orderService,
            SecurityUtil securityUtil) {

        this.roleService        = roleService;
        this.staffService       = staffService;
        this.storeService       = storeService;
        this.productService     = productService;
        this.categoryService    = categoryService;
        this.orderService       = orderService;
        this.securityUtil       = securityUtil;
    }

    // ROLE

    @Override
    @GetMapping("roles/{id}")
    public RoleResponse findRoleById(@PathVariable Integer id) {
        Staff currentStaff = securityUtil.getCurrentStaff();

        Role role = roleService.findByIdAndStoreIsNotNull(id);
        if (!role.getStore().equals(currentStaff.getStore())) {
            throw new RoleNotFoundException(id);
        }
        return RoleResponse.from(role);
    }

    @Override
    @GetMapping("roles")
    public List<SimpleRoleResponse> findAllRoles() {
        Staff currentStaff = securityUtil.getCurrentStaff();

        return roleService.findAllByStore(currentStaff.getStore()).stream()
                .map(role -> SimpleRoleResponse.from(
                        role,
                        roleService.isAllowedUpdate(role, currentStaff),
                        roleService.isAllowedDelete(role, currentStaff)))
                .collect(Collectors.toList());
    }

    @Override
    @DeleteMapping("roles/{id}")
    public Integer deleteRoleById(@PathVariable Integer id) {
        RoleResponse roleResponse = findRoleById(id);
        return roleService.delete(roleResponse.getId());
    }

    @Override
    @PostMapping("roles")
    public SimpleRoleResponse createRole(@Valid @RequestBody RoleForm roleForm) {
        Staff currentStaff = securityUtil.getCurrentStaff();

        Role role = roleService.save(roleForm);
        return SimpleRoleResponse.from(
                role,
                roleService.isAllowedUpdate(role, currentStaff),
                roleService.isAllowedDelete(role, currentStaff));
    }


    // STAFF

    @Override
    @GetMapping("staffs")
    public List<Staff> findAllStaffs() {
        Staff currentStaff = securityUtil.getCurrentStaff();
        return staffService.findAllByStoreAndIsManager(currentStaff.getStore(), false);
    }

    @Override
    @GetMapping("staffs/{id}")
    public Staff findStaffById(@PathVariable Integer id) {
        Staff currentStaff = securityUtil.getCurrentStaff();
        Staff staff = staffService.findByIdAndType(id, Staff.Type.OTHER);
        if (!staff.getStore().equals(currentStaff.getStore())) {
            throw new StaffNotFoundException(id);
        }

        return staff;
    }

    @Override
    @PutMapping("staffs/{id}")
    public Staff updateStaff(@PathVariable Integer id, @Valid @RequestBody StaffForm staffForm) {
        return staffService.update(id, staffForm);
    }

    @Override
    @DeleteMapping("staffs/{id}")
    public Integer deleteStaffById(@PathVariable Integer id) {
        Staff staff = findStaffById(id);
        return staffService.deleteById(staff.getId());
    }

    @Override
    @PostMapping("staffs")
    public Staff createStaff(@Valid @RequestBody StaffForm staffForm) {
        return staffService.save(staffForm);
    }


    // STORE

    @Override
    @GetMapping("stores/status")
    public Store.Status[] getStatusListStore() {
        return Store.Status.values();
    }

    @Override
    @GetMapping("stores")
    public List<Store> findAllStores() {
        Staff currentStaff = securityUtil.getCurrentStaff();
        Store store = currentStaff.getStore();
        return Collections.singletonList(store);
    }

    @Override
    @GetMapping("stores/{id}")
    public Store findStoreById(@PathVariable Integer id) {
        Staff currentStaff = securityUtil.getCurrentStaff();
        Store store = storeService.findById(id);
        if (!store.equals(currentStaff.getStore())) {
            throw new StoreNotFoundException(id);
        }
        return store;
    }

    @Override
    @PutMapping("stores/{id}")
    public Store updateStore(@PathVariable Integer id, @Valid @RequestBody StoreForm storeForm) {
        Store store = findStoreById(id);
        return storeService.update(store.getId(), storeForm);
    }


    // PRODUCT

    @Override
    @PostMapping("products")
    public Product createProduct(@Valid @RequestBody ProductForm productForm) {
        return productService.save(productForm);
    }

    @Override
    @PutMapping("products/{id}")
    public Product updateProduct(@PathVariable Integer id, @Valid @RequestBody ProductForm productForm) {
        Product product = findProductById(id);
        return productService.update(product.getId(), productForm);
    }

    @Override
    @GetMapping("products/{id}")
    public Product findProductById(@PathVariable Integer id) {
        Product product = productService.findById(id);
        Staff currentStaff = securityUtil.getCurrentStaff();
        if (!product.getStore().equals(currentStaff.getStore())) {
            throw new ProductNotFoundException(id);
        }
        return product;
    }

    @Override
    @GetMapping("products")
    public List<Product> findAllProducts() {
        Staff currentStaff = securityUtil.getCurrentStaff();
        return productService.findAllByStore(currentStaff.getStore());
    }

    @Override
    @DeleteMapping("products/{id}")
    public Integer deleteProductById(@PathVariable Integer id) {
        Product product = findProductById(id);
        return productService.delete(product.getId());
    }


    // CATEGORIES

    @Override
    @GetMapping("categories")
    public List<Category> findAllCategories() {
        Staff currentStaff = securityUtil.getCurrentStaff();
        Store store = currentStaff.getStore();
        return categoryService.findAllByStore(store);
    }

    @Override
    @GetMapping("categories/{id}")
    public Category findCategoryById(@PathVariable Integer id) {
        Staff currentStaff = securityUtil.getCurrentStaff();
        Category category = categoryService.findById(id);

        if (!category.getStore().equals(currentStaff.getStore())) {
            throw new CategoryNotFoundException(id);
        }

        return category;
    }

    @Override
    @PutMapping("categories/{id}")
    public Category updateCategory(@PathVariable Integer id, @Valid @RequestBody CategoryForm categoryForm) {
        Category category = findCategoryById(id);
        return categoryService.update(category.getId(), categoryForm);
    }

    @Override
    @PostMapping("categories")
    public Category createCategory(@Valid @RequestBody CategoryForm categoryForm) {
        return categoryService.save(categoryForm);
    }

    @Override
    @DeleteMapping("categories/{id}")
    public Integer deleteCategory(@PathVariable Integer id) {
        Category category = findCategoryById(id);
        return categoryService.deleteById(category.getId());
    }


    // ORDER

    @Override
    @GetMapping("orders")
    public List<Order> findAllOrders() {
        Staff currentStaff = securityUtil.getCurrentStaff();
        Store store = currentStaff.getStore();
        return orderService.findAllOrdersByStore(store);
    }

    @Override
    @GetMapping("orders/{id}")
    public Order findOrderById(@PathVariable Integer id) {
        Staff currentStaff = securityUtil.getCurrentStaff();
        Order order = orderService.findById(id);

        if (!order.getStore().equals(currentStaff.getStore())) {
            throw new OrderNotFoundException(id);
        }

        return order;
    }

    @Override
    @PutMapping("orders/{id}/status")
    public Order changeStatusOrder(@PathVariable Integer id, @RequestParam("status") Order.Status status) {
        Order order = findOrderById(id);
        order.setStatus(status);
        return orderService.save(order);
    }

}
