package com.giannini.challenge.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.List;

public class NoteDtos {

    public record Create(
        @NotBlank @Size(max = 200) String title,
        @Size(max = 10_000) String content
    ) {}

    public record Update(
        @Size(max = 200) String title,
        @Size(max = 10_000) String content,
        boolean archived
    ) {}

    public record Response(
        Long id,
        String title,
        String content,
        boolean archived,
        List<String> categories,
        Instant createdAt,
        Instant updatedAt
    ) {}

}
