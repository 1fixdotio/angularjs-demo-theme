<?php

function my_scripts() {

	wp_register_script(
		'angularjs',
		get_stylesheet_directory_uri() . '/bower_components/angular/angular.min.js'
	);

	wp_register_script(
		'angularjs-route',
		get_stylesheet_directory_uri() . '/bower_components/angular-route/angular-route.min.js'
	);

	wp_register_script(
		'angularjs-sanitize',
		get_stylesheet_directory_uri() . '/bower_components/angular-sanitize/angular-sanitize.min.js'
	);

	wp_enqueue_script(
		'my-scripts',
		get_stylesheet_directory_uri() . '/js/scripts.min.js',
		array( 'angularjs', 'angularjs-route', 'angularjs-sanitize' )
	);

	wp_localize_script(
		'my-scripts',
		'myLocalized',
		array(
			'partials' => trailingslashit( get_template_directory_uri() ) . 'partials/'
			)
	);
}

add_action( 'wp_enqueue_scripts', 'my_scripts' );

add_filter('show_admin_bar', '__return_false');