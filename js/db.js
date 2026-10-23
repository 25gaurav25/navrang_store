class Database {
  constructor() {
    const url = 'https://kqzkbaylwnjmuotughiy.supabase.co';
    const key = 'sb_publishable_sc3wdHhzWPXjCmze-ZEB3w_bpXrZXjn';
    this.client = window.supabase.createClient(url, key);
  }
}
const db = new Database();