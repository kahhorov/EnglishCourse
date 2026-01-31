import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary, {
  accordionSummaryClasses,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { MdOutlineArrowRight, MdLibraryBooks } from "react-icons/md";
import {
  Collapse,
  Box,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { db } from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

// --- STYLED COMPONENTS ---
const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  paddingTop: "10px",
  background: "none",
  "&:not(:first-of-type)": {
    borderTop: "1px dotted rgba(255, 255, 255, 0.1)",
  },
  "&::before": {
    display: "none",
  },
  borderRadius: "12px",
  transition: "all 0.3s ease",
  "&.Mui-expanded": {
    margin: "12px 0",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={
      <MdOutlineArrowRight style={{ fontSize: "1.5rem", color: "#60a5fa" }} />
    }
    {...props}
  />
))(({ theme }) => ({
  flexDirection: "row-reverse",
  padding: "8px 16px",
  borderRadius: "12px",
  minHeight: "56px !important",
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      transform: "rotate(90deg)",
    },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  "&.Mui-expanded": {
    backgroundColor: "rgba(96, 165, 250, 0.08)",
    borderBottom: "1px solid rgba(96, 165, 250, 0.2)",
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  background: "none",
  color: "#fff",
  borderRadius: "0 0 12px 12px",
}));

export default function CustomizedAccordions() {
  const [expandedTopic, setExpandedTopic] = React.useState("panel1");
  const [openFormulaKey, setOpenFormulaKey] = React.useState(null); // Faqat bitta formula ochiq bo'lishi uchun
  const [topics, setTopics] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Firebase'dan ma'lumotlarni o'qish
  React.useEffect(() => {
    const fetchTopics = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "topics"));
        const topicsData = [];
        querySnapshot.forEach((doc) => {
          topicsData.push({ id: doc.id, ...doc.data() });
        });
        topicsData.sort((a, b) => (a.order || 0) - (b.order || 0));
        setTopics(topicsData);
      } catch (error) {
        console.error("Ma'lumotlarni o'qishda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const handleTopicChange = (panel) => (event, newExpanded) => {
    setExpandedTopic(newExpanded ? panel : false);
  };

  const handleFormulaToggle = (key) => {
    // Agar ochiq bo'lganini bossa yopadi, aks holda yangisini ochib eskisin yopadi
    setOpenFormulaKey(openFormulaKey === key ? null : key);
  };

  if (loading) {
    return (
      <Box className="flex flex-col items-center justify-center py-20 gap-4">
        <CircularProgress size={60} sx={{ color: "#3b82f6" }} />
        <Typography className="text-gray-400 text-sm">
          Mavzular yuklanmoqda...
        </Typography>
      </Box>
    );
  }

  if (topics.length === 0) {
    return (
      <Box className="flex flex-col items-center justify-center py-20 px-6 border-2 border-dashed border-blue-500/20 rounded-2xl">
        <MdLibraryBooks size={60} className="text-blue-400/60" />
        <Typography className="text-white text-xl font-semibold mt-4">
          Hali mavzular yo'q
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1200px",
        mx: "auto",
        px: { xs: 1, sm: 2 },
      }}
    >
      {topics.map((topic, topicIndex) => {
        const panelId = `panel${topic.id || topicIndex + 1}`;

        return (
          <Accordion
            key={topic.id}
            expanded={expandedTopic === panelId}
            onChange={handleTopicChange(panelId)}
          >
            <AccordionSummary>
              <Box className="flex justify-between items-center w-full gap-2">
                <Typography className="font-semibold text-base sm:text-lg md:text-xl text-gray-100">
                  {topic.theme}
                </Typography>
                {topic.themeFormula && (
                  <Box className="hidden sm:flex">
                    <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400 border border-blue-500/20">
                      {topic.themeFormula}
                    </span>
                  </Box>
                )}
              </Box>
            </AccordionSummary>

            <AccordionDetails
              sx={{
                background:
                  "linear-gradient(145deg, rgba(30, 41, 59, 0.4), rgba(15, 23, 42, 0.4))",
                border: "1px solid rgba(59, 130, 246, 0.1)",
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              {topic.groupName && (
                <Box className="flex items-center gap-2 px-3 py-2 bg-blue-500/5 rounded-lg border border-blue-500/10">
                  <Box className="w-1 h-5 bg-blue-400 rounded-full" />
                  <Typography className="text-blue-300 text-sm font-semibold">
                    {topic.groupName}
                  </Typography>
                </Box>
              )}

              {topic.rules?.map((rule, ruleIndex) => (
                <Box key={ruleIndex} className="flex flex-col gap-3">
                  <Box className="flex items-start gap-3">
                    <Box className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/30 text-xs font-bold text-white">
                      {ruleIndex + 1}
                    </Box>
                    <Typography className="text-sm sm:text-base text-gray-200 leading-relaxed">
                      {rule.text}
                    </Typography>
                  </Box>

                  {rule.shape && (
                    <Box className="ml-10 inline-flex items-center gap-2 px-3 py-1 bg-gray-800/40 rounded-md w-fit">
                      <Typography className="text-[10px] sm:text-xs text-yellow-400 font-mono">
                        {rule.shape}
                      </Typography>
                    </Box>
                  )}

                  {/* FORMULALAR GRIDI */}
                  <Box
                    className="grid gap-3 mt-2"
                    sx={{
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(auto-fill, minmax(240px, 1fr))",
                      },
                    }}
                  >
                    {rule.formulas?.map((formula, formulaIndex) => {
                      const formulaKey = `${topic.id}-${ruleIndex}-${formulaIndex}`;
                      const isFormulaOpen = openFormulaKey === formulaKey;

                      return (
                        <Box key={formulaIndex} className="w-full">
                          <Box
                            onClick={() => handleFormulaToggle(formulaKey)}
                            className={`flex items-center gap-2 cursor-pointer p-3 rounded-xl transition-all duration-300 border ${
                              isFormulaOpen
                                ? "bg-blue-500/10 border-blue-500/40 shadow-lg shadow-blue-500/5"
                                : "bg-gray-800/40 border-white/5 hover:border-white/10"
                            }`}
                          >
                            {isFormulaOpen ? (
                              <KeyboardArrowDownIcon
                                sx={{ fontSize: "1.2rem", color: "#60a5fa" }}
                              />
                            ) : (
                              <KeyboardArrowRightIcon
                                sx={{ fontSize: "1.2rem", color: "#9ca3af" }}
                              />
                            )}
                            <Typography className="text-xs sm:text-sm font-medium text-gray-200 truncate">
                              {formula.formula}
                            </Typography>
                          </Box>

                          <Collapse
                            in={isFormulaOpen}
                            timeout={300}
                            unmountOnExit
                          >
                            <Box className="mt-2 p-4 rounded-xl bg-gray-900/60 border-l-4 border-blue-500/50">
                              <Typography className="text-gray-300 text-xs sm:text-sm mb-3 italic">
                                {formula.title}
                              </Typography>

                              {formula.examples?.length > 0 && (
                                <Box className="space-y-2">
                                  {formula.examples.map((ex, idx) => (
                                    <Box
                                      key={idx}
                                      className="flex gap-2 p-2 bg-white/5 rounded-lg"
                                    >
                                      <Typography className="text-blue-400 font-bold text-xs">
                                        {idx + 1}.
                                      </Typography>
                                      <Typography className="text-gray-200 text-xs sm:text-sm">
                                        {ex}
                                      </Typography>
                                    </Box>
                                  ))}
                                </Box>
                              )}

                              {formula.note && (
                                <Box className="mt-3 p-2 bg-green-500/5 border border-green-500/20 rounded-lg">
                                  <Typography className="text-green-400 text-[11px] sm:text-xs flex gap-1">
                                    {formula.note}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </Collapse>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              ))}

              {/* ODDIY QOIDALAR LISTI */}
              {topic.simpleRules?.length > 0 && (
                <Box className="mt-2 p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                  <Typography className="text-purple-300 text-sm font-bold mb-3 flex items-center gap-2">
                    <Box className="w-1 h-4 bg-purple-400 rounded-full" />{" "}
                    Qoidalar:
                  </Typography>
                  <Box className="space-y-3">
                    {topic.simpleRules.map((sRule, idx) => (
                      <Box key={idx} className="flex items-start gap-2">
                        <Typography className="text-purple-400 font-bold">
                          •
                        </Typography>
                        <Typography className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                          {sRule}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
}
