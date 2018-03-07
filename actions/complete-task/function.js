function(task, ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const api = new EllipsisApi(ellipsis);
const CollibraApi = require('collibra-api');
const collibra = CollibraApi(ellipsis);
const workflowHelpers = require('workflow-helpers')(ellipsis);

if (task.type == "vote") {
  collibra.findAsset(task.assetId).then(asset => {
    collibra.definitionAttributesFor(asset.id).then(attrs => {
      const definitions = attrs.map(ea => ea.value.toString().trim()).filter(ea => ea.length > 0);
      api.say({ message: messageFor(asset, definitions) }).then(res => {
        api.run({
          actionName: "complete-review-task",
          args: [ { name: "task", value: task.id } ]
        }).then(ellipsis.noResponse);
      });
    });
  });
} else if (task.key == "add_related_terms") {
  collibra.relationTypesWithRole("Related to").then(types => {
    const relatedToId = types[0] ? types[0].id : null;
    workflowHelpers.relationsTextFor(task.assetId, relatedToId).then(text => {
      const args = relatedToId ? [{ name: "relationTypeId", value: relatedToId }] : [];
      workflowHelpers.completeTaskWith(task, "maybe-add-relations-task", text, args);
    });
  });
} else if (task.key == "add_policies" || task.key == "add_complied_policies") {
  collibra.relationTypesWithRole("Complies to").then(types => {
    const compliesToId = types[0] ? types[0].id : null;
    workflowHelpers.relationsTextFor(task.assetId, compliesToId).then(text => {
      const args = compliesToId ? [{ name: "relationTypeId", value: compliesToId }] : [];
      workflowHelpers.completeTaskWith(task, "maybe-add-relations-task", text, args);
    });
  });
} else if (task.key == "address_comments") {
  workflowHelpers.commentsTextFor(task).then(commentsText => {
    workflowHelpers.completeSimpleTask(task, commentsText);
  });
} else if (task.type == "provide") {
  const msg = `To complete this task, you need to:\n\n${task.description}`
  api.say({ message: msg }).then(res => {
    api.run({
      actionName: "complete-comment-task",
      args: [ { name: "task", value: task.id } ]
    }).then(ellipsis.noResponse);  
  });     
} else {
  collibra.formForWorkflowTask(task.id).then(res => {
    ellipsis.success(JSON.stringify(res));  
  })
}

function messageFor(asset, definitions) {
  const link = collibra.linkFor("asset", asset.id);      
  if (definitions.length > 0) {
    const definitionsText = definitions.map(ea => "> " + ea).join("\n");
    return `The asset [${asset.name}](${link}) has definitions:\n${definitionsText}`;
  } else {
    return `The asset [${asset.name}](${link}) doesn't yet have any definitions`;
  }
}
}
