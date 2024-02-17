import { testUser1, testUser2 } from '../../portal-client/database/users'
// testUser1 -> portalUser1
// testUser2 -> portalUser2

// These users need to exist in the test IDP users.php file
export const defaultUser = {
  id: 'cl0jyfow10002fs97yimqq04c',
  userId: 'HENKE.JOHN.562270783',
  name: 'JOHN HENKE',
  isAdmin: false,
  isEnabled: true,
  role: 'User',
  username: 'cmsuser',
  password: 'cmsuserpass',
}

export const adminUser = {
  id: 'cl0jylky79105fs97hvb6sc7x',
  userId: 'KING.FLOYD.376144527',
  name: 'FLOYD KING',
  displayName: 'FLOYD KING',
  isAdmin: true,
  isEnabled: true,
  role: 'User',
  username: 'cmsadmin',
  password: 'cmsadminpass',
}

export const authorUser = {
  id: 'cl31ovlaw0013mpa8sc8t88pp',
  userId: 'NEAL.ETHEL.643097412',
  name: 'ETHEL NEAL',
  displayName: 'ETHEL NEAL',
  isAdmin: false,
  isEnabled: true,
  role: 'Author',
  username: 'cmsauthor',
  password: 'cmsauthorpass',
}

export const managerUser = {
  id: 'cl396pfxe0013moyty5r5r3z9',
  userId: 'HAVEN.CHRISTINA.561698119',
  name: 'CHRISTINA HAVEN',
  displayName: 'CHRISTINA HAVEN',
  isAdmin: false,
  isEnabled: true,
  role: 'Manager',
  username: 'cmsmanager',
  password: 'cmsmanagerpass',
}

export const portalUser1 = {
  id: 'clc053a1bc3f3f5738ae5329',
  userId: 'CAMPBELL.BERNADETTE.5244446289',
  name: 'BERNADETTE CAMPBELL',
  displayName: testUser1.displayName,
  isAdmin: false,
  isEnabled: true,
  role: 'User',
  username: 'user1',
  password: 'user1pass',
}

export const portalUser2 = {
  id: 'cl492pfxe0013moytyf93ls0f',
  userId: 'BOYD.RONALD.312969168',
  name: 'RONALD BOYD',
  displayName: testUser2.displayName,
  isAdmin: false,
  isEnabled: true,
  role: 'User',
  username: 'user2',
  password: 'user2pass',
}
