package com.lry.store.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Manager extends ManagerDetail implements Serializable {
    private String id;
    private String sole;
    private String name;
    private String pwd;
}
