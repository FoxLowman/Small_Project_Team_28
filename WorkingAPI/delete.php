<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

    $inData = getRequestInfo();

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
    } else {
        $stmt = $conn->prepare("DELETE FROM contacts WHERE ID=? AND UserID=?");
        $stmt->bind_param("ii", $inData["id"], $inData["userId"]);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            returnWithInfo("Success");
        } else {
            returnWithError("No record found or permission denied");
        }

        $stmt->close();
        $conn->close();
    }

    function getRequestInfo() {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj) {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err) {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithInfo($msg) {
        $retValue = '{"results":"' . $msg . '","error":""}';
        sendResultInfoAsJson($retValue);
    }
?>