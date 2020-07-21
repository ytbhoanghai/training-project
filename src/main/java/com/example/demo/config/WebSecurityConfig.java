package com.example.demo.config;

import com.example.demo.security.JwtAuthTokenFilter;
import com.example.demo.security.SecurityProblemSupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    private UserDetailsService userDetailsService;
    private SecurityProblemSupport securityProblemSupport;
    private JwtAuthTokenFilter jwtAuthTokenFilter;

    @Autowired
    public WebSecurityConfig(
            UserDetailsService userDetailsService,
            SecurityProblemSupport securityProblemSupport,
            JwtAuthTokenFilter jwtAuthTokenFilter) {

        this.userDetailsService = userDetailsService;
        this.securityProblemSupport = securityProblemSupport;
        this.jwtAuthTokenFilter = jwtAuthTokenFilter;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder());
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .cors().and().csrf().disable()
                .authorizeRequests()
                    .antMatchers("/api/authenticate").permitAll()
                    .anyRequest().authenticated()
                .and()
                    .exceptionHandling()
                        .authenticationEntryPoint(securityProblemSupport)
                        .accessDeniedHandler(securityProblemSupport)
                .and()
                    .sessionManagement()
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                    .httpBasic();

        http.addFilterBefore(jwtAuthTokenFilter, UsernamePasswordAuthenticationFilter.class);
    }
}
