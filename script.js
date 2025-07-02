const SUPABASE_URL = "https://ghgnpbunnjzuopcxocqa.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZ25wYnVubmp6dW9wY3hvY3FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MzA2MjIsImV4cCI6MjA2NzAwNjYyMn0.dgaTQXunx3__argTQar8qMpX6dQlqC7LZGlcdloz8NY";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

if (!localStorage.getItem("wakakusa_logged_in")) location.href = "login.html";
function logout() {
  localStorage.removeItem("wakakusa_logged_in");
  location.href = "login.html";
}

let boards = [];
let selectedBoardId = null;

async function loadBoards() {
  const { data } = await supabase.from("boards").select("*");
  boards = data;
  const menu = document.getElementById("boardMenu");
  menu.innerHTML = "";
  data.forEach(b => {
    const btn = document.createElement("button");
    btn.textContent = b.name;
    btn.onclick = () => {
      selectedBoardId = b.id;
      loadThreads();
    };
    menu.appendChild(btn);
  });
  if (data.length > 0) {
    selectedBoardId = data[0].id;
    loadThreads();
  }
}

async function loadThreads() {
  const { data } = await supabase.from("threads").select("*").eq("board_id", selectedBoardId).order("created_at", { ascending: false });
  const list = document.getElementById("threadList");
  list.innerHTML = data.map(t =>
    `<div><a href="thread.html?id=${t.id}">${t.content}</a></div>`
  ).join("") || "スレッドがありません";
}

async function createThread() {
  const name = document.getElementById("name").value || "名無しさん";
  const content = document.getElementById("content").value.trim();
  if (!content) return alert("本文を入力してください");
  const { error } = await supabase.from("threads").insert([{ name, content, board_id: selectedBoardId }]);
  if (error) return alert("投稿に失敗しました");
  loadThreads();
}

loadBoards();
