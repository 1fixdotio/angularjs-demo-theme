<!DOCTYPE html>
<html ng-app="app">
<head>
	<base href="/jsonapi/">
	<title>AngularJS Demo Theme</title>
	<?php wp_head(); ?>
</head>
<body>

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
</body>
</html>