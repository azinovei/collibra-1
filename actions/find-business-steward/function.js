function(community, ellipsis) {
  const CollibraApi = require('collibra-api');

CollibraApi(ellipsis).then(collibra => {
  const formattedCommunityLink = `[${community.label}](${collibra.linkFor('community', community.id)})`;
  collibra.findBusinessStewardForCommunity(community.id).then(bs => {
    const formattedStewardLink = bs ? `[${bs.firstName} ${bs.lastName}](${collibra.linkFor('profile', bs.id)})` : undefined;
    ellipsis.success({
      found: Boolean(bs),
      formattedCommunityLink: formattedCommunityLink,
      formattedStewardLink: formattedStewardLink
    });
  });
});
}
