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
public class ErrorResponse<T> {

    private Integer statusCode;

    private String timestamp;

    private String path;

    private T message;
}
