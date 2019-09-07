export interface IssueSearchResultItem {
  url: string;
  repository_url: string;
  labels_url: string;
  comments_url: string;
  events_url: string;
  html_url: string;
  id: number;
  node_id: string;
  number: number;
  title: string;
  user: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: false;
  };
  labels: [
    {
      id: number;
      node_id: string;
      url: string;
      name: string;
      color: string;
      default: false;
    },
    {
      id: number;
      node_id: string;
      url: string;
      name: string;
      color: string;
      default: false;
    },
    {
      id: number;
      node_id: string;
      url: string;
      name: string;
      color: string;
      default: false;
    }
  ];
  state: string;
  locked: false;
  assignee: null;
  assignees: string[];
  milestone: null;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at: null;
  author_association: string;
  pull_request: {
    url: string;
    html_url: string;
    diff_url: string;
    patch_url: string;
  };
  body: string;
  score: number;
}

export interface IssueSearchResult {
  total_count: number;
  incomplete_results: boolean;
  items: IssueSearchResultItem[];
}
