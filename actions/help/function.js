function(ellipsis) {
  const getLoginForCurrentUser = require('saved-login').getLoginForCurrentUser;
const CollibraApi = require('collibra-api');

CollibraApi(ellipsis).then(collibra => {
  getLoginForCurrentUser(ellipsis).then(login => {
    const collibraUsername = login ? login.username : "<not logged in>";
    const isCannedUser = collibra.isCannedUser(collibraUsername);
    const defaultDomain = ellipsis.env.COLLIBRA_RESTRICT_TO_DOMAIN_ID;
    collibra.domainToRestrictToParams().then(domain => {
      const domainName = domain ? domain.name : "<demo domain not set>";
      ellipsis.success({
        slackUserName: ellipsis.userInfo.fullName,
        collibraUsername: collibraUsername,
        isCannedUser: isCannedUser,
        domainName: domainName
      }, {
        choices: [
          { 
            label: "Find a demo asset definition",
            actionName: "find-definition",
            allowOthers: true
          },
          {
            label: "Add a new demo asset",
            actionName: "add-demo-asset",
            allowOthers: true
          }
        ]
      });
    });
  });
});
}
