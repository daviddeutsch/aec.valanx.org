# Troubleshooting

## Frontend Validation

If frontend validation does not work (for example if a user can get through the confirmation page without clicking the Terms-of-Services checkbox), you most likely have a jQuery conflict. You can mitigate this by only allowing the first component or plugin that loads jQuery to do so and disabling it for all others. You can disable jQuery loading in AEC in the template settings in case you have a system plugin that loads it before AEC does.
