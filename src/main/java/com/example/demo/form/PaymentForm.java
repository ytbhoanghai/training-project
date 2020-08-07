package com.example.demo.form;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentForm {

    private String shipAddress;
    private String stripeToken;
    private String phone;
    private Integer totalPrice;

}
