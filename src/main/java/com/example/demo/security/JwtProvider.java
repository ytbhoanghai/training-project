package com.example.demo.security;

import com.sun.security.auth.UserPrincipal;
import io.jsonwebtoken.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;
import java.security.Key;
import java.security.SignatureException;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class JwtProvider {

    private static final Logger LOGGER = LoggerFactory.getLogger(JwtProvider.class);

    private UserDetailsService userDetailsService;

    @Autowired
    public JwtProvider(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Value("${trainingdemo.app.jwtSecret}")
    private String jwtSecret;

    @Value("${trainingdemo.app.jwtExpiration}")
    private Integer jwtExpiration;

    private final SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;

    public String generateJwtToken(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        Key key = getKeyFromJwtSecret(jwtSecret);
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration * 1000))
                .signWith(key, signatureAlgorithm)
                .compact();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser()
                    .setSigningKey(getKeyFromJwtSecret(jwtSecret))
                    .parseClaimsJws(authToken);

            return true;
        } catch (MalformedJwtException e) {
            LOGGER.error("Invalid JWT token -> Message: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            LOGGER.error("Expired JWT token -> Message: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            LOGGER.error("Unsupported JWT token -> Message: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            LOGGER.error("JWT claims string is empty -> Message: {}", e.getMessage());
        }

        return false;
    }

    public String getUsernameFromJwtToken(String token) {
        return Jwts.parser()
                .setSigningKey(getKeyFromJwtSecret(jwtSecret))
                .parseClaimsJws(token)
                .getBody().getSubject();
    }

    private Key getKeyFromJwtSecret(String jwtSecret) {
        byte[] jwtTokenSecretBytes = DatatypeConverter.parseBase64Binary(jwtSecret);
        return new SecretKeySpec(jwtTokenSecretBytes, signatureAlgorithm.getJcaName());
    }

}
