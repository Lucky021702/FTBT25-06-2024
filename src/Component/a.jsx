return (
    <>
      <div style={{ margin: "2rem" }}>
        <Box>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", justifyContent: "end" }}
          >
            <TextField
              label="Enter Project Name..."
              variant="outlined"
              onChange={(e) => filterProjects(e.target.value)}
            />
            <Button
              type='button'
              style={{ fontSize: "2.5rem", color: "black" }}
              onClick={toggleDrawer(true)}
            >
              <GoPlus />
            </Button>
          </form>
        </Box>
      </div>
      <Drawer
        anchor='right'
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{ style: { width: "40%" } }}
      >
        <AppBar position='static'>
          <Toolbar>
            <Typography variant='h6' style={{ flexGrow: 1 }}>
              Add New Project
            </Typography>
            <MUIButton edge='end' color='inherit' onClick={toggleDrawer(false)}>
              <CloseIcon />
            </MUIButton>
          </Toolbar>
        </AppBar>
        <div
          style={{
            margin: "70px 22px 0px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "15px", fontWeight: "bold" }}>
            Client Name<span style={{ color: "red" }}>*</span>
          </span>
          <span>
            <TextField
              name='fullName'
              variant='standard'
              placeholder='Full Name'
              onChange={(e) => setClientName(e.target.value)}
              sx={{ width: "315px" }}
            />
          </span>
        </div>
        <div
          style={{
            margin: "70px 22px 0px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "15px", fontWeight: "bold" }}>
            Source Language<span style={{ color: "red" }}>*</span>
          </span>
          <span>
            <select
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              style={{ width: "200px" }}
            >
              <option value='' disabled>
                Select Language
              </option>
              {language.map((lang) => (
                <option key={lang._id} value={lang.languageName}>
                  {lang.languageName}
                </option>
              ))}
            </select>
          </span>
        </div>
        <div
          style={{
            margin: "70px 22px 0px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "15px", fontWeight: "bold"}}>
            Target Language<span style={{ color: "red" }}>*</span>
          </span>
          <span>
          <select
      value={targetLanguage}
      onChange={handleLanguageChange}
      style={{ width: "200px" }}
    >
      <option value="" disabled>
        Select Language
      </option>
      {language.map((lang) => (
        <option key={lang._id} value={lang.languageName}>
          {lang.languageName}
        </option>
      ))}
    </select>
          </span>
        </div>
        {targetLanguage[0] ? <div style={{display:"flex", justifyContent:"right", marginRight:"4rem",marginTop:"10px"}}>
        <ul>
        <h3>Target Languages</h3>
          {targetLanguage.map((lang, index) => (
            <li key={index} style={{marginLeft:"20px"}}>{lang}</li>
          ))}
        </ul>
     
    </div> : null}
    <span style={{display:"flex",justifyContent:"center",position:"fixed",top:"35rem",right:"19rem"}}>
        <Button onClick={handleCreateProject} >Save</Button>
        </span>
      </Drawer>
      <Drawer
        anchor='right'
        open={isDrawerOpenTasks}
        onClose={toggleDrawerAssignTasks(false)}
        PaperProps={{ style: { width: "40%" }}}
      >
        <div style={{  overflowX: "auto" }}>
        <AppBar position='static'>
          <Toolbar>
            <Typography variant='h6' style={{ flexGrow: 1 }}>
              Assign Tasks
            </Typography>
            <MUIButton edge='end' color='inherit' onClick={toggleDrawerAssignTasks(false)}>
              <CloseIcon />
            </MUIButton>
          </Toolbar>
        </AppBar>
        <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'scroll' }}>
        {projectData?.tasks && projectData.tasks.map((task, index) => (
  <Card key={index} sx={{ maxWidth: 600, minWidth: 600, marginBottom: 2 }}>
    <CardContent>
      <div
        style={{
          margin: "70px 22px 0px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: "15px", fontWeight: "bold" }}>
          Source Language<span style={{ color: "red" }}>*</span>
        </span>
        <span>
          <TextField
            name='sourceLanguage'
            variant='standard'
            value={projects?.map((project) => (project.sourceLanguage))}
            sx={{ width: "255px" }}
          />
        </span>
      </div>
      <div
        style={{
          margin: "70px 22px 0px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: "15px", fontWeight: "bold" }}>
          Target Language<span style={{ color: "red" }}>*</span>
        </span>
        <span>
          <select
            value={task.assignTargetLanguage || null}
            style={{ width: "255px" }}
          >
            <option value='' disabled>
              Select Language
            </option>
            {language.map((lang) => (
              <option key={lang._id} value={lang.languageName}>
                {lang.languageName}
              </option>
            ))}
          </select>
        </span>
      </div>
      <div
        style={{
          margin: "70px 22px 0px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: "15px", fontWeight: "bold" }}>
          Service Type<span style={{ color: "red" }}>*</span>
        </span>
        <span>
          <select
            value={task.serviceType || serviceType}
            onChange={(e) => handleServiceTypeChange(e, index)}
            style={{ width: "255px" }}
          >
            <option value='' disabled>
              Service type
            </option>
            <option value='FT'>FT</option>
            <option value='BT'>BT</option>
            <option value='QC'>QC</option>
          </select>
        </span>
      </div>
      <div
        style={{
          margin: "70px 22px 0px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: "15px", fontWeight: "bold" }}>
          Assign To<span style={{ color: "red" }}>*</span>
        </span>
        <span>
          <TextField
            name='assignTo'
            variant='standard'
            value={task.assignTo || ''}
            disabled
            sx={{ width: "255px" }}
          />
        </span>
      </div>
      <div
        style={{
          margin: "70px 22px 0px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: "15px", fontWeight: "bold" }}>
          TAT<span style={{ color: "red" }}>*</span>
        </span>
        <div>
          {task.date }
        </div>
      </div>
    </CardContent>
  </Card>
))}
 
       <Card sx={{ maxWidth: 600, minWidth:600 }}>
        <CardContent>
        <div
          style={{
            margin: "70px 22px 0px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "15px", fontWeight: "bold" }}>
            Source Language<span style={{ color: "red" }}>*</span>
          </span>
          <span>
            <TextField
              name='fullName'
              variant='standard'
              value={projectData?.sourceLanguage}
              sx={{ width: "255px" }}
            />
          </span>
        </div>
        <div
          style={{
            margin: "70px 22px 0px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "15px", fontWeight: "bold" }}>
            Target Language<span style={{ color: "red" }}>*</span>
          </span>
          <span>
            <select
      value={assignTargetLanguage}
      onChange={(e) => setAssignTargetLanguage(e.target.value)}
      style={{ width: "255px" }}
    >
      <option value='' disabled>
        Select Language
      </option>
      {projectData?.targetLanguage?.length > 0 ? (
        projectData.targetLanguage.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))
      ) : (
        <option disabled>No languages found</option>
      )}
    </select>
           
          </span>
        </div>
        <div
          style={{
            margin: "70px 22px 0px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "15px", fontWeight: "bold" }}>
            Service Type<span style={{ color: "red" }}>*</span>
          </span>
          <span>
          <select
      value={serviceType}
      onChange={handleServiceTypeChange}
      style={{ width: "255px" }}
    >
      <option value='' disabled>
        Service type
      </option>
      <option value='FT'>
        FT
      </option>
      <option value='BT'>
        BT
      </option>
      <option value='QC'>
        QC
      </option>
    </select>
          </span>
        </div>
        <div
          style={{
            margin: "70px 22px 0px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "15px", fontWeight: "bold" }}>
            Assign To<span style={{ color: "red" }}>*</span>
          </span>
          <span>
          <select
      value={assign}
      onChange={handleAssignChange}
      style={{ width: "255px" }}
    >
      {assignTasks.length === 0 && <option value="" disabled>Select Name</option>}
      {assignTasks && assignTasks.length > 0 ? assignTasks?.map((item, index) => (
        <option key={index} value={item}>
          {item}
        </option>
      )) : (
        <option disabled>Please select service type</option>
      )}
    </select>
          </span>
        </div>
        <div
          style={{
            margin: "70px 22px 0px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "15px", fontWeight: "bold" }}>
            TAT<span style={{ color: "red" }}>*</span>
          </span>
          <div>
      <div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        </div>
        <div style={{marginTop:"10px"}}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label="Select Time"
            value={selectedTime}
            onChange={handleTimeChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </div>
    </div>
    </div>
    <div style={{display:"flex",justifyContent:"center",alignItems:"center", marginTop:"20px"}}>
    <Button onClick={AssignTasksApi}>Assign</Button>
    </div>
  </CardContent>
        </Card>
    </div>
    </div>
      </Drawer>
      <div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {[
                  "Project Name",
                  "Status",
                  "Source Language",
                  "Source File",
                  "Target Language",
                  "CreatedOn",
                  "Actions",
                ].map((header, index) => (
                  <TableCell
                    key={index}
                    style={{
                      fontWeight: "bold",
                      fontSize: "1rem",
                      width: "17%",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {projects?.map((project, index) => (
                <TableRow key={index}>
                  <TableCell style={{ fontSize: "1rem" }}>
                    {project.projectName}
                  </TableCell>
                  <TableCell style={{ fontSize: "1rem" }}>
                    {project.status.charAt(0).toUpperCase() +
                      project.status.slice(1).toLowerCase()}
                  </TableCell>
                  <TableCell>
                    <Box display='flex' alignItems='center'>
                      <input
                        multiple
                        id={`source-file-input-${index}`}
                        type='file'
                        accept='.csv'
                        onChange={(e) => handleSourceUploadChange(e, index)}
                        style={{ display: "none" }}
                      />
                      <label htmlFor={`source-file-input-${index}`}>
                        <IconButton component='span'>
                          <CloudUploadIcon />
                        </IconButton>
                      </label>
                      <Typography variant='body1'>
                        {project.sourceUpload
                          ? `${
                              project.sourceUpload.length <= 1
                                ? `${project.sourceUpload.length} File`
                                : `${project.sourceUpload.length} Files`
                            }`
                          : "No file chosen"}
                      </Typography>
                    </Box>
                  </TableCell>
                   <TableCell style={{ fontSize: "1rem" }}>
                    {project?.sourceLanguage}
                  </TableCell>
                   <TableCell style={{ fontSize: "1rem" }}>        
                   <ul>
      {project.targetLanguage.map((language, index) => (
        <li key={index}>{language}</li>
      ))}
      </ul>
                  </TableCell>
                  <TableCell style={{ fontSize: "1rem" }}>{formatDate(project.createdAt)}</TableCell>
                  <TableCell>
                    <Box
                      display='flex'
                      alignItems='center'
                      paddingRight='5rem'
                      className='icon-container'
                    >
                      <MdOutlinePeople className="icon" onClick={() => handleIconClick(project)} />
                      <Button
                        onClick={() => handleDelete(index)}
                        style={{ fontSize: "2rem" }}
                      >
                        <MdDelete />
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {/* <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        TransitionComponent={Slide}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity="error"
          elevation={6}
          variant="filled"
        >
          {errorMessage}
        </MuiAlert>
      </Snackbar> */}
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
  <Alert
    onClose={handleClose}
    severity="success"
    variant="filled"
    sx={{ width: '100%' }}
  >
    Project Assigned👍
  </Alert>
</Snackbar>
<Snackbar open={openError} autoHideDuration={3000} onClose={handleCloseError}>
  <Alert
    onClose={handleCloseError}
    severity="error"
    variant="filled"
    sx={{ width: '100%' }}
  >
    Project Assigned Failed❌
  </Alert>
</Snackbar>
<Snackbar open={openDelete} autoHideDuration={3000} onClose={handleCloseDelete}>
  <Alert
    onClose={handleCloseDelete}
    severity="success"
    variant="filled"
    sx={{ width: '100%' }}
  >
    Project deleted successfully
  </Alert>
</Snackbar>
    </>
  );
};
 
export default Project;