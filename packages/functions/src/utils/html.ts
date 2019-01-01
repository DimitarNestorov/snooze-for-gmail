export const errorOccurredMarkup = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>An error occurred.</title>
</head>
<body>
	<p>An error occurred. Please try again later.</p>
</body>
</html>`

export const redirectingMarkup = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Redirecting...</title>
</head>
<body>
<script type="text/javascript">
	opener && opener.focus && opener.focus();
	close();
</script>
</body>
</html>`
