const [applications, setApplications] = useState<Application[]>([])
const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
  loadApplications()
}, [])

const loadApplications = async () => {
  try {
    setLoading(true)
    const apps = await ApplicationService.getApplications()
    setApplications(apps)
    if (apps.length > 0 && !selectedApplication) {
      setSelectedApplication(apps[0])
    }
  } catch (error) {
    console.error('Failed to load applications:', error)
  } finally {
    setLoading(false)
  }
}

const handleStatusUpdate = async (id: string, status: ApplicationStatus, comments?: string) => {
  try {
    await ApplicationService.updateApplicationStatus(id, status, comments)

    // Update local state
    setApplications((prev) =>
      prev.map((app) =>
        app.id === parseInt(id) ? { ...app, status, adminComments: comments } : app
      )
    )

    if (selectedApplication && selectedApplication.id === parseInt(id)) {
      setSelectedApplication({
        ...selectedApplication,
        status,
        adminComments: comments
      })
    }
  } catch (error) {
    console.error('Failed to update application status:', error)
  }
}
