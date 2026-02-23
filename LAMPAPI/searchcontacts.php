<?php

    $inData = getRequestInfo();
    
    $searchResults = "";
    $searchCount = 0;
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error) 
    {
        returnWithError($conn->connect_error);
    } 
    else 
    {
        $searchQuery = "%" . $inData["search"] . "%";
        
        $stmt = $conn->prepare("SELECT * FROM contacts WHERE (FirstName LIKE ? OR LastName LIKE ?) AND UserID=?");
        $stmt->bind_param("ssi", $searchQuery, $searchQuery, $inData["userId"]);
        $stmt->execute();
        
        $result = $stmt->get_result();
        
        while($row = $result->fetch_assoc())
        {
            if( $searchCount > 0 )
            {
                $searchResults .= ",";
            }
            $searchCount++;
            $searchResults .= '{"firstName":"' . $row["FirstName"] . '", "lastName":"' . $row["LastName"] . '", "phone":"' . $row["Phone"] . '", "email":"' . $row["Email"] . '", "id":' . $row["ID"] . '}';
        }
        
        if( $searchCount == 0 )
        {
            returnWithError( "No Records Found" );
        }
        else
        {
            returnWithInfo( $searchResults );
        }
        
        $stmt->close();
        $conn->close();
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson( $obj )
    {
        header('Content-type: application/json');
        echo $obj;
    }
    
    function returnWithError( $err )
    {
        $retValue = '{"results":[],"error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }
    
    function returnWithInfo( $searchResults )
    {
        $retValue = '{"results":[' . $searchResults . '],"error":""}';
        sendResultInfoAsJson( $retValue );
    }
    
?>