package com.zuttokin.rose.data.database;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@SpringBootTest
public class MysqlConnectionTest {

    @Autowired
    private DataSource dataSource;

    @Test
    public void connect() throws SQLException {
        try (Connection conn = dataSource.getConnection()) {
            String productName = conn.getMetaData().getDatabaseProductName();
            String productVersion = conn.getMetaData().getDatabaseProductVersion();
            System.out.println("✓ Database connection succeeded！");
            System.out.println("- Username: " + conn.getMetaData().getUserName());
            System.out.println("- Database: " + productName + " " + productVersion);
            System.out.println("- Reference: " + conn.getMetaData().getURL());
        } catch (SQLException e) {
            System.err.println("✕ Database connection failed, " + e.getMessage());
            throw e;
        }
    }
}
