package com.example.demo.controller;

import com.example.demo.controller.ui.*;
import com.example.demo.entity.*;
import com.example.demo.exception.*;
import com.example.demo.form.*;
import com.example.demo.response.RoleResponse;
import com.example.demo.response.SimpleRoleResponse;
import com.example.demo.response.StaffResponse;
import com.example.demo.security.SecurityUtil;
import com.example.demo.security.constants.*;
import com.example.demo.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasAuthority(\"" + RolePermission.READ + "\")")
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
    @PreAuthorize("hasAuthority(\"" + RolePermission.READ + "\")")
    public List<SimpleRoleResponse> findAllRoles() {
        Staff currentStaff = securityUtil.getCurrentStaff();

        return roleService.findAllByStore(currentStaff.getStore()).stream()
                .sorted((o1, o2) -> o2.getCreatedAt().compareTo(o1.getCreatedAt()))
                .filter(Role::getGrantable)
                .map(role -> SimpleRoleResponse.from(
                        role,
                        roleService.isAllowedUpdate(role, currentStaff),
                        roleService.isAllowedDelete(role, currentStaff)))
                .collect(Collectors.toList());
    }

    @Override
    @PutMapping("roles/{id}")
    public Role updateRoleById(@PathVariable Integer id, @Valid @RequestBody RoleForm roleForm) {
        return roleService.update(id, roleForm);
    }

    @Override
    @DeleteMapping("roles/{id}")
    @PreAuthorize("hasAuthority(\"" + RolePermission.DELETE + "\")")
    public Integer deleteRoleById(@PathVariable Integer id) {
        RoleResponse roleResponse = findRoleById(id);
        return roleService.delete(roleResponse.getId());
    }

    @Override
    @PostMapping("roles")
    @PreAuthorize("hasAuthority(\"" + RolePermission.CREATE + "\")")
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
    @PreAuthorize("hasAuthority(\"" + StaffPermission.READ + "\")")
    public List<StaffResponse> findAllStaffs() {
        Staff currentStaff = securityUtil.getCurrentStaff();
        return staffService.findAllByStoreAndIsManager(currentStaff.getStore(), false).stream()
                .sorted((o1, o2) -> o2.getCreatedAt().compareTo(o1.getCreatedAt()))
                .map(staff -> new StaffResponse(
                        staff,
                        staffService.isAllowedUpdate(staff, currentStaff),
                        staffService.isAllowedDelete(staff, currentStaff))
                )
                .collect(Collectors.toList());
    }

    @Override
    @GetMapping("staffs/{id}")
    @PreAuthorize("hasAuthority(\"" + StaffPermission.READ + "\")")
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
    @PreAuthorize("hasAuthority(\"" + StaffPermission.UPDATE + "\")")
    public Staff updateStaff(@PathVariable Integer id, @Valid @RequestBody StaffForm staffForm) {
        return staffService.update(id, staffForm);
    }

    @Override
    @DeleteMapping("staffs/{id}")
    @PreAuthorize("hasAuthority(\"" + StaffPermission.DELETE + "\")")
    public Integer deleteStaffById(@PathVariable Integer id) {
        Staff staff = findStaffById(id);
        return staffService.deleteById(staff.getId());
    }

    @Override
    @PostMapping("staffs")
    @PreAuthorize("hasAuthority(\"" + StaffPermission.CREATE + "\")")
    public Staff createStaff(@Valid @RequestBody StaffForm staffForm) {
        return staffService.save(staffForm);
    }


    // STORE

    @Override
    @GetMapping("stores/status")
    @PreAuthorize("hasAuthority(\"" + StorePermission.READ + "\")")
    public Store.Status[] getStatusListStore() {
        return Store.Status.values();
    }

    @Override
    @GetMapping("stores")
    @PreAuthorize("hasAuthority(\"" + StorePermission.READ + "\")")
    public List<Store> findAllStores() {
        Staff currentStaff = securityUtil.getCurrentStaff();
        Store store = currentStaff.getStore();
        return Collections.singletonList(store);
    }

    @Override
    @GetMapping("stores/{id}")
    @PreAuthorize("hasAuthority(\"" + StorePermission.READ + "\")")
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
    @PreAuthorize("hasAuthority(\"" + StorePermission.UPDATE + "\")")
    public Store updateStore(@PathVariable Integer id, @Valid @RequestBody StoreForm storeForm) {
        Store store = findStoreById(id);
        return storeService.update(store.getId(), storeForm);
    }


    // PRODUCT

    @Override
    @PostMapping("products")
    @PreAuthorize("hasAuthority(\"" + ProductPermission.CREATE + "\")")
    public Product createProduct(@Valid @RequestBody ProductForm productForm) {
        return productService.save(productForm);
    }

    @Override
    @PutMapping("products/{id}")
    @PreAuthorize("hasAuthority(\"" + ProductPermission.UPDATE + "\")")
    public Product updateProduct(@PathVariable Integer id, @Valid @RequestBody ProductForm productForm) {
        Product product = findProductById(id);
        return productService.update(product.getId(), productForm);
    }

    @Override
    @GetMapping("products/{id}")
    @PreAuthorize("hasAuthority(\"" + ProductPermission.READ + "\")")
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
    @PreAuthorize("hasAuthority(\"" + ProductPermission.READ + "\")")
    public List<Product> findAllProducts() {
        Staff currentStaff = securityUtil.getCurrentStaff();
        return productService.findAllByStore(currentStaff.getStore()).stream()
                .sorted((o1, o2) -> o2.getCreatedAt().compareTo(o1.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Override
    @DeleteMapping("products/{id}")
    @PreAuthorize("hasAuthority(\"" + ProductPermission.DELETE + "\")")
    public Integer deleteProductById(@PathVariable Integer id) {
        Product product = findProductById(id);
        return productService.delete(product.getId());
    }


    // CATEGORIES

    @Override
    @GetMapping("categories")
    @PreAuthorize("hasAuthority(\"" + CategoryPermission.READ + "\")")
    public List<Category> findAllCategories() {
        Staff currentStaff = securityUtil.getCurrentStaff();
        Store store = currentStaff.getStore();
        return categoryService.findAllByStore(store).stream()
                .sorted((o1, o2) -> o2.getCreatedAt().compareTo(o1.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Override
    @GetMapping("categories/{id}")
    @PreAuthorize("hasAuthority(\"" + CategoryPermission.READ + "\")")
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
    @PreAuthorize("hasAuthority(\"" + CategoryPermission.UPDATE + "\")")
    public Category updateCategory(@PathVariable Integer id, @Valid @RequestBody CategoryForm categoryForm) {
        Category category = findCategoryById(id);
        return categoryService.update(category.getId(), categoryForm);
    }

    @Override
    @PostMapping("categories")
    @PreAuthorize("hasAuthority(\"" + CategoryPermission.CREATE + "\")")
    public Category createCategory(@Valid @RequestBody CategoryForm categoryForm) {
        return categoryService.save(categoryForm);
    }

    @Override
    @DeleteMapping("categories/{id}")
    @PreAuthorize("hasAuthority(\"" + CategoryPermission.DELETE + "\")")
    public Integer deleteCategory(@PathVariable Integer id) {
        Category category = findCategoryById(id);
        return categoryService.deleteById(category.getId());
    }


    // ORDER

    @Override
    @GetMapping("orders")
    @PreAuthorize("hasAuthority(\"" + OrderPermission.READ + "\")")
    public List<Order> findAllOrders() {
        Staff currentStaff = securityUtil.getCurrentStaff();
        Store store = currentStaff.getStore();
        return orderService.findAllOrdersByStore(store).stream()
                .sorted((o1, o2) -> o2.getCreatedAt().compareTo(o1.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Override
    @GetMapping("orders/{id}")
    @PreAuthorize("hasAuthority(\"" + OrderPermission.READ + "\")")
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
    @PreAuthorize("hasAuthority(\"" + OrderPermission.UPDATE + "\")")
    public Order changeStatusOrder(@PathVariable Integer id, @RequestParam("status") Order.Status status) {
        Order order = findOrderById(id);
        order.setStatus(status);
        return orderService.save(order);
    }

}
