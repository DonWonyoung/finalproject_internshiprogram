## How to run
- Open Laragon application, show hidden icons, right click Laragon, start all, right click Laragon again, Laragon, Database, and Open.
- Open the project in backend folder at Visual Studio Code, new terminal and type ```php artisan serve```, and CTRL + click the link.
- Create database with the name **ecommerce_final**.
- Type php artisan migrate in the new terminal to create tables in the database.
- After you deleted a data and want to add a new data afterwards, remember to auto increment the index.
```
SELECT @max_value := MAX(id) FROM tablename;

SET @max_value := IFNULL(@max_value, 0);
SET @new_value := @max_value + 1;

SET @sql := CONCAT('ALTER TABLE tablename AUTO_INCREMENT = ', @new_value);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
```
- Remember to keep open the browser and not to close them.

## Using Postman
- Open Postman application, go to workspaces -> create workspace -> blank workspace -> enter name and create.
- Press new button at the upper left and choose HTTP.
- In the right side of the workspace name, three dots -> add request, add five requests: index (view), show (view by index), store, update, and delete.
- Type ```http://localhost:8000/api/tablename``` for all requests.
- For methods, index and show use GET, store use POST, update use PUT, and delete use DELETE.
- To access all requests, go to body -> form-data, because it is the only way to upload image.

## Final step
Open the project in the React folder at Visual Studio Code, new terminal and type ```npm start```.
