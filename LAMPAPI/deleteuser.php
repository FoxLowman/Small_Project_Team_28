<?php
    $inData = getRequestInfo();

    $userId = $inData["userId"] ?? 0;

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error) 
    {
        returnWithError($conn->connect_error);
    } 
    else 
    {
        $stmt1 = $conn->prepare("DELETE FROM contacts WHERE UserID=?");
        $stmt1->bind_param("i", $userId);
        $stmt1->execute();
        $stmt1->close();

        $stmt2 = $conn->prepare("DELETE FROM users WHERE ID=?");
        $stmt2->bind_param("i", $userId);
        $stmt2->execute();

        if ($stmt2->affected_rows > 0) 
        {
            returnWithInfo("User and associated contacts deleted successfully");
        } 
        else 
        {
            returnWithError("User not found or already deleted");
        }

        $stmt2->close();
        $conn->close();
    }

    function getRequestInfo() 
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj) 
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err) 
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithInfo($msg) 
    {
        $retValue = '{"results":"' . $msg . '","error":""}';
        sendResultInfoAsJson($retValue);
    }
?>