import * as React from 'react';
import { Link } from 'react-router-dom';

export const tagColor = (state) => {
  if (state === 'type') {
    return '#2db7f5';
  } else if (state === 'warning' || state === 'unverified' || state === 'inactive') {
    return '#f0ad4e';
  } else if (state === 'success' || state === 'verified') {
    return '#5cb85c';
  } else if (state === 'ready' || state === 'active') {
    return '#87d068';
  } else if (state === 'danger') {
    return '#d9534f';
  } else if (state === 'Lazada') {
    return '#12384A';
  } else if (state === 'Shopee') {
    return '#ED6136';
  }
}

function renderValue(value, fallback) {
  return (
    <span className="object-value">
      {value || fallback}
      &nbsp;
    </span>
  );
}

function renderAction(action) {
  return (
    <span className="activity-action">
      {action}
      &nbsp;
    </span>
  );
}

function renderType(type) {
  return (
    <span className="object-type">
      {type.replace(/\:\:/g, '').split(/(?=[A-Z])/).join(' ')}
      &nbsp;
    </span>
  );
}

export const renderActivity = (namespace, activity) => {
  const owner = activity.owner;
  const key = activity.key;
  const action = key.replace(/_/g, ' ');
  const actor = activity.actor;

  let ownerEl = (owner.id) ? renderValue(owner.email, null) : null;
  let actionEl = renderAction(action);
  let actorEl = (actor.id) ? (
    <span>
      {renderType(actor.type)}
      {renderValue(actor.trackable_name, actor.id)}
    </span>
  ) : null;

  let content = (
    <div>
      {ownerEl}
      {actionEl}
      {actorEl}
    </div>
  );

  if (namespace === 'client') {

  } else if (namespace === 'admin') {

  }

  return content;
}