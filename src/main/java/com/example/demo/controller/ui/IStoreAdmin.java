package com.example.demo.controller.ui;

import com.example.demo.entity.Store;
import com.example.demo.form.StoreForm;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.Valid;
import java.util.List;

@Transactional
public interface IStoreAdmin extends IStore {

    Store createStore(@Valid StoreForm storeForm);

    Integer deleteStoreById(Integer id);

}
