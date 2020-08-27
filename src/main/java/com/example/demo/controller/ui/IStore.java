package com.example.demo.controller.ui;

import com.example.demo.entity.Store;
import com.example.demo.form.StoreForm;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.Valid;
import java.util.List;

@Transactional
public interface IStore {

    Store.Status[] getStatusListStore();

    List<Store> findAllStores();

    Store findStoreById(Integer id);

    Store updateStore(Integer id, @Valid StoreForm storeForm);

}
