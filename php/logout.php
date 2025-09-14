<?php
session_start();

// セッション変数をすべて削除
$_SESSION = array();

// クッキーを削除（セッションIDのクッキー）
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// セッションを破棄
session_destroy();

// ログインページにリダイレクト
header("Location: index2.html");
exit();
?>
