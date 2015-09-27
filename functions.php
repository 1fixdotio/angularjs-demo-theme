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

	wp_register_script(
		'angularjs-slick',
		get_stylesheet_directory_uri() . '/bower_components/angular-slick/dist/slick.min.js'
	);

	wp_register_script(
		'slick-carousel',
		get_stylesheet_directory_uri() . '/bower_components/slick-carousel/slick/slick.min.js'
	);

	wp_register_script(
		'my-jquery',
		get_stylesheet_directory_uri() . '/bower_components/jquery/dist/jquery.min.js'
	);

	wp_enqueue_script(
		'my-scripts',
		get_stylesheet_directory_uri() . '/js/scripts.min.js',
		array( 'my-jquery', 'angularjs', 'angularjs-route', 'angularjs-sanitize', 'slick-carousel', 'angularjs-slick' )
	);

	wp_enqueue_script(
		'wp-service',
		get_stylesheet_directory_uri() . '/js/WPService.min.js'
	);

	wp_enqueue_style(
		'slick-css',
		get_stylesheet_directory_uri() . '/bower_components/slick-carousel/slick/slick.css'
	);

	wp_enqueue_style(
		'slick-theme-css',
		get_stylesheet_directory_uri() . '/bower_components/slick-carousel/slick/slick-theme.css'
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

function my_add_link_target( $html ) {

	$html = preg_replace( '/(<a.*")>/', '$1 target="_self">', $html );
	return $html;
}
add_filter( 'image_send_to_editor', 'my_add_link_target', 10 );

// add_filter('show_admin_bar', '__return_false');

function my_theme_setup() {

	add_theme_support( 'post-thumbnails' );
}
add_action( 'after_setup_theme', 'my_theme_setup' );

function my_rest_prepare_post( $data, $post, $request ) {

	$_data = $data->data;
	$thumbnail_id = get_post_thumbnail_id( $post->ID );
	$thumbnail = wp_get_attachment_image_src( $thumbnail_id );
	$_data['featured_image_thumbnail_url'] = $thumbnail[0];
	$data->data = $_data;

	return $data;
}
add_filter( 'rest_prepare_post', 'my_rest_prepare_post', 10, 3 );

function my_rest_prepare_attachment( $data, $post, $request ) {

	$_data = $data->data;
	if ( 'image' == $_data['media_type'] )
		$_data['is_image'] = true;
	else
		$_data['is_image'] = false;
	$data->data = $_data;

	return $data;
}
add_filter( 'rest_prepare_attachment', 'my_rest_prepare_attachment', 10, 3 );

function my_rest_post_query( $args, $request ) {

	if ( 'attachment' == $args['post_type'] || ( isset( $args['s'] ) && ! empty( $args['s'] ) ) )
		$args['posts_per_page'] = -1;
	elseif ( 10 != $request['per_page'] ) {
		// if per_page != 10 (the default value), get it from $request, and now we can make it a negative integer
		$args['posts_per_page'] = $request['per_page'];
	}

	return $args;
}
add_filter( 'rest_post_query', 'my_rest_post_query', 10, 2 );