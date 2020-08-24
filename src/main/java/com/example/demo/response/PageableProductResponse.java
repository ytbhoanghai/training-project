package com.example.demo.response;

import com.example.demo.entity.Product;
import com.example.demo.entity.Store;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PageableProductResponse {

    private Integer currentPage;

    private Integer totalPages;

    private Integer totalElements;

    private Integer size;

    private List<ProductResponse> products;

    public static PageableProductResponse build(Page<Product> page) {
        return PageableProductResponse.builder()
                .currentPage(page.getPageable().getPageNumber())
                .totalPages(page.getTotalPages())
                .totalElements(Math.toIntExact(page.getTotalElements()))
                .size(page.getPageable().getPageSize())
                .products(
                        page.getContent().stream()
                                .map(ProductResponse::build)
                                .collect(Collectors.toList()))
                .build();
    }
}
