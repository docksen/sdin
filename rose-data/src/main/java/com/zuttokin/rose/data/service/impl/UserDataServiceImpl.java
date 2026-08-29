package com.zuttokin.rose.data.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zuttokin.rose.data.entity.UserDataEntity;
import com.zuttokin.rose.data.mapper.UserDataMapper;
import com.zuttokin.rose.data.service.UserDataService;
import org.springframework.stereotype.Service;

@Service
public class UserDataServiceImpl extends ServiceImpl<UserDataMapper, UserDataEntity>
        implements UserDataService {

    @Override
    public UserDataEntity readUser() {
        return baseMapper.selectById("");
    }

}
