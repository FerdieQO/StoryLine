<%
   response.expires=-1
   sql="SELECT * FROM Word"
   set conn=Server.CreateObject("ADODB.Connection")
   conn.Provider="Microsoft.Jet.OLEDB.4.0"
   conn.Open(Server.Mappath(""))

   %>