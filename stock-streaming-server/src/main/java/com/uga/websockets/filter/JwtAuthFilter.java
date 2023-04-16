package com.uga.websockets.filter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import com.uga.websockets.helper.JwtTokenHelper;

import io.jsonwebtoken.io.IOException;


public class JwtAuthFilter extends OncePerRequestFilter {

	private UserDetailsService userDetailsService;
	private JwtTokenHelper jwtTokenHelper;

	public JwtAuthFilter(UserDetailsService userDetailsService, JwtTokenHelper jwtTokenHelper) {
		this.userDetailsService = userDetailsService;
		this.jwtTokenHelper = jwtTokenHelper;

	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException, java.io.IOException {

		String jwtToken = jwtTokenHelper.getToken(request);

		if (null != jwtToken) {

			String user = jwtTokenHelper.getUsernameFromToken(jwtToken);

			if (null != user) {

				UserDetails userDetails = userDetailsService.loadUserByUsername(user);
				
                // validating jwt token
				if (jwtTokenHelper.validateToken(jwtToken, userDetails)) {

					UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
							userDetails, null, userDetails.getAuthorities());
					authentication.setDetails(new WebAuthenticationDetails(request));

					SecurityContextHolder.getContext().setAuthentication(authentication);
				}
			}
		}

		filterChain.doFilter(request, response);

	}

}
