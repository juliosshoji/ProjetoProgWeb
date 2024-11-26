<?php
function obterRanking() {
    $pdo = getDatabaseConnection();

    $stmt = $pdo->query("SELECT u.nome, SUM(p.pontos) AS total_pontos
                         FROM usuarios u
                         LEFT JOIN partidas p ON u.id = p.usuario_id
                         GROUP BY u.id
                         ORDER BY total_pontos DESC");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

obterRanking();

?>
