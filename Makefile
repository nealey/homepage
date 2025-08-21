publish:
	hugo build
	rsync -vaz public/ neale@melville.woozle.org:/srv/www/woozle.org/
