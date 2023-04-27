import { useState, SyntheticEvent, FC } from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { useAppSelector } from "@/hooks/useRedux";

interface CashBoxAccordionProps {}

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={2} {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "rgba(0, 0, 0, .07)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const CashBoxAccordion: FC<CashBoxAccordionProps> = ({}) => {
  const [expanded, setExpanded] = useState<string | false>(false);
  const { cashboxState } = useAppSelector((state) => state);

  const handleChange =
    (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <div>
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary aria-controls="panel2bh-content" id="panel2bh-header">
          <h3 className="text-xl">
            Записи:{" "}
            <span className="font-semibold">{cashboxState.visitsTotal}</span>
          </h3>
        </AccordionSummary>
        <AccordionDetails>
          <p>
            Наличные:{" "}
            <span className="font-semibold">{cashboxState.visitsCash}</span>
          </p>
          <p>
            Карта:{" "}
            <span className="font-semibold">{cashboxState.visitsCard}</span>
          </p>
          <p>
            Каспи:{" "}
            <span className="font-semibold">{cashboxState.visitsKaspi}</span>
          </p>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary aria-controls="panel3bh-content" id="panel3bh-header">
          <h3 className="text-xl">
            Продажи М:{" "}
            <span className="font-semibold">{cashboxState.salesMenTotal}</span>
          </h3>
        </AccordionSummary>
        <AccordionDetails>
          <p>
            Наличные:{" "}
            <span className="font-semibold">{cashboxState.salesMenCash}</span>
          </p>
          <p>
            Карта:{" "}
            <span className="font-semibold">{cashboxState.salesMenCard}</span>
          </p>
          <p>
            Каспи:{" "}
            <span className="font-semibold">{cashboxState.salesMenKaspi}</span>
          </p>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
      >
        <AccordionSummary aria-controls="panel4bh-content" id="panel4bh-header">
          <h3 className="text-xl">
            Краска:{" "}
            <span className="font-semibold">{cashboxState.paintTotal}</span>
          </h3>
        </AccordionSummary>
        <AccordionDetails>
          {cashboxState.employeeSalaryPaint.map((paint) => (
            <p key={paint.id}>
              {paint.employee}:{" "}
              <span className="font-semibold">{paint.value}</span>
            </p>
          ))}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default CashBoxAccordion;
