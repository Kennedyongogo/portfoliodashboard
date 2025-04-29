import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  IconButton,
  Paper,
  Divider,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  GitHub,
  LinkedIn,
  Twitter,
  Email,
  Phone,
  LocationOn,
  Edit,
  Save,
} from "@mui/icons-material";

const API_BASE_URL = "http://localhost:3003";

const Portfolio = () => {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    bio: "",
    email: "",
    phone: "",
    location: "",
    skills: [],
    socialLinks: {
      github: "",
      linkedin: "",
      twitter: "",
    },
  });

  useEffect(() => {
    fetchProfile();
    fetchSkills();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/profile`);
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      const data = await response.json();
      setProfile(data);
      setFormData({
        name: data.name || "",
        title: data.title || "",
        bio: data.bio || "",
        email: data.email || "",
        phone: data.phone || "",
        location: data.location || "",
        skills: data.skills || [],
        socialLinks: data.socialLinks || {
          github: "",
          linkedin: "",
          twitter: "",
        },
      });
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch profile");
      setLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/skills`);
      if (!response.ok) {
        throw new Error("Failed to fetch skills");
      }
      const data = await response.json();
      setSkills(data);
    } catch (err) {
      console.error("Failed to fetch skills:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      setProfile(data);
      setEditMode(false);
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h4" component="h1">
            Portfolio
          </Typography>
          <Button
            variant="contained"
            startIcon={editMode ? <Save /> : <Edit />}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Save Changes" : "Edit Profile"}
          </Button>
        </Box>

        <Grid container spacing={4}>
          {/* Profile Image and Basic Info */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={profile?.profileImage || "/default-profile.jpg"}
                alt="Profile"
              />
              <CardContent>
                {editMode ? (
                  <>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      margin="normal"
                    />
                  </>
                ) : (
                  <>
                    <Typography variant="h5" component="h2">
                      {profile?.name}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {profile?.title}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Contact and Social Links */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Contact Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    {editMode ? (
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        margin="normal"
                      />
                    ) : (
                      <Box display="flex" alignItems="center">
                        <Email sx={{ mr: 1 }} />
                        <Typography>{profile?.email}</Typography>
                      </Box>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {editMode ? (
                      <TextField
                        fullWidth
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        margin="normal"
                      />
                    ) : (
                      <Box display="flex" alignItems="center">
                        <Phone sx={{ mr: 1 }} />
                        <Typography>{profile?.phone}</Typography>
                      </Box>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    {editMode ? (
                      <TextField
                        fullWidth
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        margin="normal"
                      />
                    ) : (
                      <Box display="flex" alignItems="center">
                        <LocationOn sx={{ mr: 1 }} />
                        <Typography>{profile?.location}</Typography>
                      </Box>
                    )}
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                  Social Links
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    {editMode ? (
                      <TextField
                        fullWidth
                        label="GitHub"
                        value={formData.socialLinks.github}
                        onChange={(e) =>
                          handleSocialLinkChange("github", e.target.value)
                        }
                        margin="normal"
                      />
                    ) : (
                      <Button
                        startIcon={<GitHub />}
                        href={profile?.socialLinks?.github}
                        target="_blank"
                      >
                        GitHub
                      </Button>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    {editMode ? (
                      <TextField
                        fullWidth
                        label="LinkedIn"
                        value={formData.socialLinks.linkedin}
                        onChange={(e) =>
                          handleSocialLinkChange("linkedin", e.target.value)
                        }
                        margin="normal"
                      />
                    ) : (
                      <Button
                        startIcon={<LinkedIn />}
                        href={profile?.socialLinks?.linkedin}
                        target="_blank"
                      >
                        LinkedIn
                      </Button>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    {editMode ? (
                      <TextField
                        fullWidth
                        label="Twitter"
                        value={formData.socialLinks.twitter}
                        onChange={(e) =>
                          handleSocialLinkChange("twitter", e.target.value)
                        }
                        margin="normal"
                      />
                    ) : (
                      <Button
                        startIcon={<Twitter />}
                        href={profile?.socialLinks?.twitter}
                        target="_blank"
                      >
                        Twitter
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Bio and Skills */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  About Me
                </Typography>
                {editMode ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    margin="normal"
                  />
                ) : (
                  <Typography paragraph>{profile?.bio}</Typography>
                )}

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                  Skills
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {skills.map((skill) => (
                    <Chip
                      key={skill.id}
                      label={`${skill.name} - ${skill.category} (${
                        skill.proficiency
                      }%) - ${skill.yearsOfExperience || 0} yrs`}
                      color="primary"
                      sx={{
                        p: 1,
                        height: "auto",
                        "& .MuiChip-label": {
                          display: "block",
                          whiteSpace: "normal",
                          py: 0.5,
                        },
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Portfolio;
