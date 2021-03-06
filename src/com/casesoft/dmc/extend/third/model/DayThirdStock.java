package com.casesoft.dmc.extend.third.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Created by john on 2017-02-27.
 */
@Table(name="third_daystock")
@Entity
public class DayThirdStock extends BaseThirdStock{

    private String day;

    @Id
    @Column(name="day",nullable = false,length = 40)
    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }
}
