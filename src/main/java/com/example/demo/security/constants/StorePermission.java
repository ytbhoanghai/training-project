package com.example.demo.security.constants;

import javax.persistence.StoredProcedureQuery;

public final class StorePermission {

    public static final String CREATE = "store_create";

    public static final String READ = "store_read";

    public static final String UPDATE = "store_update";

    public static final String DELETE = "store_delete";

    private StorePermission() { }

}
