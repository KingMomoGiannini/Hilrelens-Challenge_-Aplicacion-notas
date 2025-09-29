package com.giannini.challenge.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins; // e.g. http://localhost:5173

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Podés pasar múltiples orígenes separados por coma en application.properties
        String[] origins = allowedOrigins.split(",");

        registry.addMapping("/**")
                .allowedOrigins(origins)
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
