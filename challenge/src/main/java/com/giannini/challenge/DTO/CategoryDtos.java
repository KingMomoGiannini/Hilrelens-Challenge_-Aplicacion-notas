package com.giannini.challenge.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CategoryDtos {

    public record Create(
            @NotBlank @Size(max = 80) String name
    ) {}

    public record Response(
            Long id,
            String name
    ) {}
}
