<!DOCTYPE html>
<html ng-app="app">
<head>
	<base href="/jsonapi/">
	<title>Angular JS Sample Theme</title>
	<?php wp_head(); ?>
</head>
<body>

	<header>
		<h1>
			<a href="<?php echo site_url(); ?>">Angular JS Sample Theme</a>
		</h1>
	</header>

	<div ng-view></div>

	<footer>
		&copy; <?php echo date( 'Y' ); ?>
	</footer>

</body>
</html>