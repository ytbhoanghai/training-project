package com.example.demo.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

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

}
