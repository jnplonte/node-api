export function isAdmin(authData: object = {}): boolean {
	return authData['roleId'] && authData['roleId'] === 1;
}
