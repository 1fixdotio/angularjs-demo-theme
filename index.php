<!DOCTYPE html>
<html>
<head>
	<base href="<?php $url_info = parse_url( site_url() ); echo trailingslashit( $url_info['path'] ); ?>">
	<title>Home | AngularJS Demo Theme</title>
	<?php wp_head(); ?>
</head>
<body>
	<div id="page" ng-app="app">
		<header>
			<h1>
				<a href="<?php echo site_url(); ?>">AngularJS Demo Theme</a>
			</h1>
		</header>

		<div ng-view></div>

		<footer>
			&copy; <?php echo date( 'Y' ); ?>
		</footer>
		<?php wp_footer(); ?>
	</div>
</body>
</html>