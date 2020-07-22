package com.example.demo.response;

import com.example.demo.entity.Resource;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceResponse {

    private String name;

    private Set<PermissionResponse> permissions;

    public static ResourceResponse from(Resource resource) {
        return ResourceResponse.builder()
                .name(resource.getName())
                .permissions(resource.getPermissions().stream()
                        .map(PermissionResponse::from)
                        .collect(Collectors.toSet())
                ).build();
    }
}

