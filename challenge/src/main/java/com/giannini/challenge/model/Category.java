package com.giannini.challenge.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "categories",
        uniqueConstraints = @UniqueConstraint(name = "uk_category_name", columnNames = "name"))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String name;

    // Lado inverso (opcional para este challenge, pero útil)
    @ManyToMany(mappedBy = "categories")
    @Builder.Default
    private Set<Note> notes = new HashSet<>();
}
