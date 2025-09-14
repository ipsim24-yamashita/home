<?php
session_start(); // セッションを開始

$correct_password = "55555"; // 正しいパスワード

// フォームから送信されたパスワードを取得
$submitted_password = $_POST['password'];

if ($submitted_password === $correct_password) {
    // パスワードが一致した場合、セッションにログイン情報を保存
    $_SESSION['authenticated'] = true;
    
    // 保護されたページへリダイレクト
    header("Location: protected_page.php");
    exit();
} else {
    // パスワードが一致しない場合、エラーメッセージを表示してログインページに戻る
    echo "パスワードが違います。";
    echo '<br><a href="https://drive.google.com">戻る</a>';
}
?>
