# Import & Export

## Importing

The newer releases of AEC (0.14 and above) have an import feature. It is accessible by going to AEC Central, then clicking on the Import icon.

TODO: Interface Images

To prepare you import file, it must be in CSV format with NO column headings. The fields that AEC will import are:

|Field        |Description|
|-------------|-----------|
|User ID|Only use if not importing a new user and associating the Payment Plan and or Invoice Number.|
|User Full|Name the users full name.|
|Username|The Username used for login.|
|User Email|The email address of the user.|
|Password|The password for the user to use on login.|
|Payment Plan ID|The payment plan ID you want to assign the user to. Note: when importing, you can use separate csv files (each one with the users for a specific plan) and assign them during the import to a specific plan.|
|Invoice Number|An invoice number to be assigned to the user as the secondary Identification. AEC will still create its own invoice number but the secondary identification will become an alias for the primary invoice number.|
|Membership Expiration|Expiration date of the membership.|

Note: We will import the Joomla user, if you are using CB or JomSocial the user will be created, but other than the joomla standard registration fields, no other user fields are available for import using this feature. If you need to import other information, then you will need to find a 3rd party import component to do so. Once that is done you can import the Payment Plan ID, Invoice Number, and Membership Expiration by associated that with the User ID.


Once you have prepared your csv file. you are reedy to do the import.

From here you can select a file already loaded on the server or upload a new file. To select a previous uploaded file, highlight the file then click on the Apply icon. To load a new file, just browse to the file and upload it to AEC. Once this is done you will be presented with a screen similar to shown below.

For each column of your csv file, you will be presented with a drop down, letting you assign the values in that column to a field value as seen in the table above.

Assign each column to the field it represents or choose ignore on that column.

Assign Plan: You can choose a plan to have all of the users being imported in that specific csv file to a specific plan.

When you are ready to import, click on the Apply icon.

## Exporting

TODO: Interface Images

To get to the export function go to AEC Central--> Export

Once this is done you will get the export screen, which we will take a look at in sections.

Export Preset: Select a preset (or an automatically saved previous export) instead of making the selections below. You can also click Load on the upper right and preview the preset.

Delete: Delete this Preset highlighted (on apply) . This will not delete Autosave but ones that you have named and saved as new.


Payment Plan: Filter out subscriptions with this Payment Plan. You can choose one (highlight) or multiple plans (CTRL + highlight),

Status: Only export subscriptions with this status. You can only choose ONE status to export at a time.

Order by: Order by one of the following. You can only choose ONE to sort by.


Fields: Put in the ReWrite Engine fields, separated by semicolons, that you want each exported item to hold. It is a good idea to copy these to a note pad, the csv file will not have the column headers in it.

As you can see from the above image, you can open up the ReWrite Engine fields available by clicking on, for example, User Account Related.


Save as New? Check this box to save your settings as a new preset.

Save Name: Save new preset under this name.

Exporting Method: The file type you want to export to. Currently only CSV.

If this is a new export, after you name it click Apply, and AEC will save it.

When you are ready to export, click on Export.
