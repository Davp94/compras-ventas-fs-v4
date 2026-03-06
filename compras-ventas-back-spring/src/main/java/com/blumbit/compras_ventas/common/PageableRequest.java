package com.blumbit.compras_ventas.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PageableRequest<T> {
    private int pageSize;
    private int pageNumber;
    private String sortField;
    private String sortOrder;
    private T criterials;
    private String filterValue;
}
