<?php
session_start(); // セッションを開始

// 認証済みか確認
if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
    // 認証されていない場合はログインページにリダイレクト
    header("Location: index2.html");
    exit();
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>保護されたページ</title>
</head>
<body>
    <h2>このページは保護されています</h2>
    <p>ログインに成功しました。</p>
    <a href="logout.php">ログアウト</a>
</body>
</html>
