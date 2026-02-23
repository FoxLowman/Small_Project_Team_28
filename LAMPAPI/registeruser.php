<?php
    $inData = getRequestInfo();

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
    } else {
        $hashedPassword = password_hash($inData["password"], PASSWORD_DEFAULT);
        $stmt = $conn->prepare("SELECT ID FROM users WHERE Login=?");
        $stmt->bind_param("s", $inData["login"]);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->fetch_assoc()) {
            returnWithError("Username already taken");
        } else {
            $stmt = $conn->prepare("INSERT INTO users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssss", $inData["firstName"], $inData["lastName"], $inData["login"], $hashedPassword);
            $stmt->execute();
            returnWithInfo($conn->insert_id);
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
        $retValue = '{"id":0,"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithInfo($id) {
        $retValue = '{"id":' . $id . ',"error":""}';
        sendResultInfoAsJson($retValue);
    }
?>